import 'package:dio/dio.dart';

import '../../../shared/models/models.dart';

class ApiConfig {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';
  static const String localUrl = 'http://localhost:8000/api/v1';
  static const String emulatorUrl = 'http://10.0.2.2:8000/api/v1';
  static const Duration timeout = Duration(seconds: 30);
}

class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? error;

  ApiResponse({required this.success, this.data, this.error});

  factory ApiResponse.success(T data) => ApiResponse(success: true, data: data);

  factory ApiResponse.failure(String error) =>
      ApiResponse(success: false, error: error);
}

class ApiService {
  late final Dio _dio;
  final String baseUrl;

  ApiService({this.baseUrl = ApiConfig.baseUrl}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: ApiConfig.timeout,
        receiveTimeout: ApiConfig.timeout,
        headers: const {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
  }

  Future<ApiResponse<T>> get<T>(
    String endpoint,
    T Function(dynamic json) fromJson,
  ) async {
    try {
      final response = await _dio.get(endpoint);
      return ApiResponse.success(fromJson(response.data));
    } on DioException catch (e) {
      return ApiResponse.failure(_handleError(e));
    } catch (e) {
      return ApiResponse.failure(e.toString());
    }
  }

  Future<ApiResponse<T>> post<T>(
    String endpoint,
    Map<String, dynamic> body,
    T Function(dynamic json) fromJson,
  ) async {
    try {
      final response = await _dio.post(endpoint, data: body);
      return ApiResponse.success(fromJson(response.data));
    } on DioException catch (e) {
      return ApiResponse.failure(_handleError(e));
    } catch (e) {
      return ApiResponse.failure(e.toString());
    }
  }

  String _handleError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
        return 'Connection timeout. Please check your internet.';
      case DioExceptionType.receiveTimeout:
        return 'Server took too long to respond.';
      case DioExceptionType.badResponse:
        return e.response?.data['detail']?.toString() ??
            'Server error: ${e.response?.statusCode}';
      case DioExceptionType.connectionError:
        return 'Cannot connect to server. Is the backend running?';
      default:
        return e.message ?? 'Unknown error occurred';
    }
  }

  Future<ApiResponse<Rider>> registerRider({
    required String name,
    required String phone,
    required String persona,
    required String zoneId,
    String? email,
  }) async {
    final normalizedPhone = phone.startsWith('+') ? phone : '+91$phone';
    return post('/riders/', {
      'name': name,
      'phone': normalizedPhone,
      'email': email,
      'persona': persona,
      'zone_id': zoneId,
    }, (json) => Rider.fromJson(json as Map<String, dynamic>));
  }

  Future<ApiResponse<Rider>> getRiderById(String riderId) async {
    return get('/riders/$riderId', (json) => Rider.fromJson(json));
  }

  Future<ApiResponse<List<Zone>>> getZones() async {
    return get(
      '/zones/',
      (json) => (json as List)
          .map((zone) => Zone.fromJson(zone as Map<String, dynamic>))
          .toList(),
    );
  }

  Future<ApiResponse<Zone>> getZoneById(String zoneId) async {
    return get('/zones/$zoneId', (json) => Zone.fromJson(json));
  }

  Future<ApiResponse<List<Policy>>> getRiderPolicies(String riderId) async {
    return get(
      '/policies/?rider_id=$riderId',
      (json) => (json as List)
          .map((policy) => Policy.fromJson(policy as Map<String, dynamic>))
          .toList(),
    );
  }

  Future<ApiResponse<Policy>> getActivePolicy(String riderId) async {
    final response = await getRiderPolicies(riderId);
    if (!response.success || response.data == null) {
      return ApiResponse.failure(response.error ?? 'Failed to load policies');
    }

    final activePolicies =
        response.data!.where((policy) => policy.isActive).toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

    if (activePolicies.isEmpty) {
      return ApiResponse.failure('No active policy found');
    }

    return ApiResponse.success(activePolicies.first);
  }

  Future<ApiResponse<Policy>> createPolicy({
    required String riderId,
    required String zoneId,
    required String persona,
  }) async {
    return post('/policies/', {
      'rider_id': riderId,
      'zone_id': zoneId,
      'persona': persona,
      'duration_days': 30,
    }, (json) => Policy.fromJson(json as Map<String, dynamic>));
  }

  Future<ApiResponse<List<Claim>>> getRiderClaims(String riderId) async {
    return get(
      '/claims/?rider_id=$riderId',
      (json) => (json as List)
          .map((claim) => Claim.fromJson(claim as Map<String, dynamic>))
          .toList(),
    );
  }

  Future<ApiResponse<Map<String, dynamic>>> getClaimsSummary(
    String riderId,
  ) async {
    final response = await getRiderClaims(riderId);
    if (!response.success || response.data == null) {
      return ApiResponse.failure(response.error ?? 'Failed to load claims');
    }

    final claims = response.data!;
    final paidClaims = claims.where((claim) => claim.isPaid).toList();
    final approvedClaims = claims.where((claim) => claim.isApproved).toList();

    return ApiResponse.success({
      'total': claims.length,
      'approved': approvedClaims.length,
      'paid': paidClaims.length,
      'amount': paidClaims.fold<double>(0, (sum, claim) => sum + claim.amount),
    });
  }

  Future<ApiResponse<WeatherData>> getZoneWeather(String zoneId) async {
    return get(
      '/weather/current/$zoneId',
      (json) => WeatherData.fromJson((json as Map<String, dynamic>)['weather']),
    );
  }

  Future<ApiResponse<List<TriggerStatusModel>>> getZoneTriggers(
    String zoneId,
  ) async {
    return get(
      '/triggers/status/$zoneId',
      (json) => (((json as Map<String, dynamic>)['triggers'] ?? []) as List)
          .map(
            (trigger) =>
                TriggerStatusModel.fromJson(trigger as Map<String, dynamic>),
          )
          .toList(),
    );
  }

  Future<ApiResponse<DashboardStats>> getDashboardStats() async {
    return get('/dashboard/stats', (json) => DashboardStats.fromJson(json));
  }

  Future<bool> healthCheck() async {
    try {
      final uri = Uri.parse(baseUrl.replaceFirst('/api/v1', '') + '/health');
      final response = await _dio.getUri(uri);
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  void dispose() {
    _dio.close(force: true);
  }
}

final apiService = ApiService();
