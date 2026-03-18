import 'package:dio/dio.dart';
import '../../../shared/models/models.dart';

/// API configuration
class ApiConfig {
  // For Android emulator use 10.0.2.2, for iOS simulator use localhost
  // For physical device, use your machine's IP address
  static const String baseUrl = 'http://10.0.2.2:8000';

  // Alternative URLs for different environments
  static const String localUrl = 'http://localhost:8000';
  static const String emulatorUrl = 'http://10.0.2.2:8000';

  static const Duration timeout = Duration(seconds: 30);
}

/// API response wrapper
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? error;

  ApiResponse({required this.success, this.data, this.error});

  factory ApiResponse.success(T data) {
    return ApiResponse(success: true, data: data);
  }

  factory ApiResponse.failure(String error) {
    return ApiResponse(success: false, error: error);
  }
}

/// Main API service for connecting to FastAPI backend
class ApiService {
  late final Dio _dio;
  final String baseUrl;

  ApiService({this.baseUrl = ApiConfig.baseUrl}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: ApiConfig.timeout,
        receiveTimeout: ApiConfig.timeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add logging interceptor for debugging
    _dio.interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (obj) => print('API: $obj'),
      ),
    );
  }

  /// Generic GET request
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

  /// Generic POST request
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
        return 'Server error: ${e.response?.statusCode}';
      case DioExceptionType.connectionError:
        return 'Cannot connect to server. Is the backend running?';
      default:
        return e.message ?? 'Unknown error occurred';
    }
  }

  // ==================== Rider APIs ====================

  /// Register a new rider
  Future<ApiResponse<Rider>> registerRider({
    required String name,
    required String phone,
    required String persona,
    required String zoneId,
    String? email,
  }) async {
    return post('/api/riders/', {
      'name': name,
      'phone': phone,
      'email': email,
      'persona': persona,
      'zone_id': zoneId,
    }, (json) => Rider.fromJson(json));
  }

  /// Get rider by phone
  Future<ApiResponse<Rider>> getRiderByPhone(String phone) async {
    return get('/api/riders/phone/$phone', (json) => Rider.fromJson(json));
  }

  /// Get rider by ID
  Future<ApiResponse<Rider>> getRiderById(String riderId) async {
    return get('/api/riders/$riderId', (json) => Rider.fromJson(json));
  }

  /// Update rider location
  Future<ApiResponse<Rider>> updateLocation(
    String riderId,
    double lat,
    double lon,
  ) async {
    return post('/api/riders/$riderId/location', {
      'latitude': lat,
      'longitude': lon,
    }, (json) => Rider.fromJson(json));
  }

  // ==================== Zone APIs ====================

  /// Get all zones
  Future<ApiResponse<List<Zone>>> getZones() async {
    return get(
      '/api/zones/',
      (json) => (json as List).map((z) => Zone.fromJson(z)).toList(),
    );
  }

  /// Get zone by ID
  Future<ApiResponse<Zone>> getZoneById(String zoneId) async {
    return get('/api/zones/$zoneId', (json) => Zone.fromJson(json));
  }

  // ==================== Policy APIs ====================

  /// Get policies for a rider
  Future<ApiResponse<List<Policy>>> getRiderPolicies(String riderId) async {
    return get(
      '/api/policies/rider/$riderId',
      (json) => (json as List).map((p) => Policy.fromJson(p)).toList(),
    );
  }

  /// Get active policy for a rider
  Future<ApiResponse<Policy>> getActivePolicy(String riderId) async {
    return get(
      '/api/policies/rider/$riderId/active',
      (json) => Policy.fromJson(json),
    );
  }

  /// Create a new policy
  Future<ApiResponse<Policy>> createPolicy({
    required String riderId,
    required String zoneId,
    required String persona,
  }) async {
    return post('/api/policies/', {
      'rider_id': riderId,
      'zone_id': zoneId,
      'persona': persona,
    }, (json) => Policy.fromJson(json));
  }

  // ==================== Claims APIs ====================

  /// Get claims for a rider
  Future<ApiResponse<List<Claim>>> getRiderClaims(String riderId) async {
    return get(
      '/api/claims/rider/$riderId',
      (json) => (json as List).map((c) => Claim.fromJson(c)).toList(),
    );
  }

  /// Get claims summary
  Future<ApiResponse<Map<String, dynamic>>> getClaimsSummary(
    String riderId,
  ) async {
    return get(
      '/api/claims/rider/$riderId/summary',
      (json) => json as Map<String, dynamic>,
    );
  }

  // ==================== Weather & Triggers APIs ====================

  /// Get current weather for a zone
  Future<ApiResponse<WeatherData>> getZoneWeather(String zoneId) async {
    return get(
      '/api/weather/zone/$zoneId',
      (json) => WeatherData.fromJson(json),
    );
  }

  /// Get weather by coordinates
  Future<ApiResponse<WeatherData>> getWeatherByCoords(
    double lat,
    double lon,
  ) async {
    return get(
      '/api/weather/current?lat=$lat&lon=$lon',
      (json) => WeatherData.fromJson(json),
    );
  }

  /// Get active triggers for a zone
  Future<ApiResponse<List<TriggerEvent>>> getZoneTriggers(String zoneId) async {
    return get(
      '/api/triggers/zone/$zoneId',
      (json) => (json as List).map((t) => TriggerEvent.fromJson(t)).toList(),
    );
  }

  /// Get all active triggers
  Future<ApiResponse<List<TriggerEvent>>> getActiveTriggers() async {
    return get(
      '/api/triggers/active',
      (json) => (json as List).map((t) => TriggerEvent.fromJson(t)).toList(),
    );
  }

  // ==================== Dashboard APIs ====================

  /// Get dashboard stats
  Future<ApiResponse<DashboardStats>> getDashboardStats() async {
    return get('/api/dashboard/stats', (json) => DashboardStats.fromJson(json));
  }

  /// Health check
  Future<bool> healthCheck() async {
    try {
      final response = await _dio.get('/health');
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  void dispose() {
    _dio.close();
  }
}

/// Singleton instance
final apiService = ApiService();
