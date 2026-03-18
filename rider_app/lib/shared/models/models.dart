/// Rider model
class Rider {
  final String id;
  final String name;
  final String phone;
  final String? email;
  final String persona;
  final String zoneId;
  final double? latitude;
  final double? longitude;
  final double riskScore;
  final String status;
  final DateTime createdAt;

  Rider({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    required this.persona,
    required this.zoneId,
    this.latitude,
    this.longitude,
    required this.riskScore,
    required this.status,
    required this.createdAt,
  });

  factory Rider.fromJson(Map<String, dynamic> json) {
    return Rider(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      email: json['email'],
      persona: json['persona'] ?? 'food_delivery',
      zoneId: json['zone_id'] ?? '',
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      riskScore: (json['risk_score'] ?? 0.5).toDouble(),
      status: json['status'] ?? 'active',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'email': email,
      'persona': persona,
      'zone_id': zoneId,
      'latitude': latitude,
      'longitude': longitude,
      'risk_score': riskScore,
      'status': status,
    };
  }
}

/// Zone model
class Zone {
  final String id;
  final String name;
  final String city;
  final String? state;
  final String country;
  final double latitude;
  final double longitude;
  final double radiusKm;
  final String riskLevel;
  final double basePremiumFactor;
  final bool isActive;

  Zone({
    required this.id,
    required this.name,
    required this.city,
    this.state,
    required this.country,
    required this.latitude,
    required this.longitude,
    required this.radiusKm,
    required this.riskLevel,
    required this.basePremiumFactor,
    required this.isActive,
  });

  factory Zone.fromJson(Map<String, dynamic> json) {
    return Zone(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      city: json['city'] ?? '',
      state: json['state'],
      country: json['country'] ?? 'IN',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      radiusKm: (json['radius_km'] ?? 2.5).toDouble(),
      riskLevel: json['risk_level'] ?? 'medium',
      basePremiumFactor: (json['base_premium_factor'] ?? 1.0).toDouble(),
      isActive: json['is_active'] ?? true,
    );
  }
}

/// Policy model
class Policy {
  final String id;
  final String riderId;
  final String zoneId;
  final String persona;
  final double premium;
  final double coverage;
  final DateTime startDate;
  final DateTime endDate;
  final String status;
  final String? txHash;
  final DateTime createdAt;

  Policy({
    required this.id,
    required this.riderId,
    required this.zoneId,
    required this.persona,
    required this.premium,
    required this.coverage,
    required this.startDate,
    required this.endDate,
    required this.status,
    this.txHash,
    required this.createdAt,
  });

  factory Policy.fromJson(Map<String, dynamic> json) {
    return Policy(
      id: json['id'] ?? '',
      riderId: json['rider_id'] ?? '',
      zoneId: json['zone_id'] ?? '',
      persona: json['persona'] ?? 'food_delivery',
      premium: (json['premium'] ?? 0).toDouble(),
      coverage: (json['coverage'] ?? 0).toDouble(),
      startDate: json['start_date'] != null
          ? DateTime.parse(json['start_date'])
          : DateTime.now(),
      endDate: json['end_date'] != null
          ? DateTime.parse(json['end_date'])
          : DateTime.now().add(const Duration(days: 30)),
      status: json['status'] ?? 'active',
      txHash: json['tx_hash'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
    );
  }

  int get daysRemaining {
    final now = DateTime.now();
    final diff = endDate.difference(now).inDays;
    return diff > 0 ? diff : 0;
  }

  bool get isActive => status == 'active' && endDate.isAfter(DateTime.now());
}

/// Claim model
class Claim {
  final String id;
  final String policyId;
  final String riderId;
  final String triggerType;
  final double triggerValue;
  final double threshold;
  final double amount;
  final String status;
  final double fraudScore;
  final String? aiDecision;
  final String? txHash;
  final DateTime createdAt;
  final DateTime? processedAt;

  Claim({
    required this.id,
    required this.policyId,
    required this.riderId,
    required this.triggerType,
    required this.triggerValue,
    required this.threshold,
    required this.amount,
    required this.status,
    required this.fraudScore,
    this.aiDecision,
    this.txHash,
    required this.createdAt,
    this.processedAt,
  });

  factory Claim.fromJson(Map<String, dynamic> json) {
    return Claim(
      id: json['id'] ?? '',
      policyId: json['policy_id'] ?? '',
      riderId: json['rider_id'] ?? '',
      triggerType: json['trigger_type'] ?? 'rain',
      triggerValue: (json['trigger_value'] ?? 0).toDouble(),
      threshold: (json['threshold'] ?? 0).toDouble(),
      amount: (json['amount'] ?? 0).toDouble(),
      status: json['status'] ?? 'pending',
      fraudScore: (json['fraud_score'] ?? 0).toDouble(),
      aiDecision: json['ai_decision'],
      txHash: json['tx_hash'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
      processedAt: json['processed_at'] != null
          ? DateTime.parse(json['processed_at'])
          : null,
    );
  }

  bool get isPaid => status == 'paid';
  bool get isApproved => status == 'approved' || status == 'paid';
}

/// Trigger event model
class TriggerEvent {
  final String id;
  final String zoneId;
  final String triggerType;
  final double value;
  final double threshold;
  final bool isActive;
  final String? source;
  final DateTime createdAt;
  final DateTime? expiresAt;

  TriggerEvent({
    required this.id,
    required this.zoneId,
    required this.triggerType,
    required this.value,
    required this.threshold,
    required this.isActive,
    this.source,
    required this.createdAt,
    this.expiresAt,
  });

  factory TriggerEvent.fromJson(Map<String, dynamic> json) {
    return TriggerEvent(
      id: json['id'] ?? '',
      zoneId: json['zone_id'] ?? '',
      triggerType: json['trigger_type'] ?? 'rain',
      value: (json['value'] ?? 0).toDouble(),
      threshold: (json['threshold'] ?? 0).toDouble(),
      isActive: json['is_active'] ?? false,
      source: json['source'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
      expiresAt: json['expires_at'] != null
          ? DateTime.parse(json['expires_at'])
          : null,
    );
  }

  String get statusLabel {
    if (!isActive) return 'OK';
    if (value >= threshold * 0.8) return 'WATCH';
    if (value >= threshold) return 'TRIGGERED';
    return 'OK';
  }
}

/// Weather data model
class WeatherData {
  final double temperature;
  final double humidity;
  final double rainfall;
  final double windSpeed;
  final String condition;
  final String description;

  WeatherData({
    required this.temperature,
    required this.humidity,
    required this.rainfall,
    required this.windSpeed,
    required this.condition,
    required this.description,
  });

  factory WeatherData.fromJson(Map<String, dynamic> json) {
    return WeatherData(
      temperature: (json['temperature'] ?? 0).toDouble(),
      humidity: (json['humidity'] ?? 0).toDouble(),
      rainfall: (json['rainfall'] ?? 0).toDouble(),
      windSpeed: (json['wind_speed'] ?? 0).toDouble(),
      condition: json['condition'] ?? 'Clear',
      description: json['description'] ?? '',
    );
  }
}

/// Dashboard stats model
class DashboardStats {
  final int totalRiders;
  final int activePolicies;
  final int totalClaims;
  final int paidClaims;
  final double totalPremiums;
  final double totalPayouts;
  final int activeZones;

  DashboardStats({
    required this.totalRiders,
    required this.activePolicies,
    required this.totalClaims,
    required this.paidClaims,
    required this.totalPremiums,
    required this.totalPayouts,
    required this.activeZones,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      totalRiders: json['total_riders'] ?? 0,
      activePolicies: json['active_policies'] ?? 0,
      totalClaims: json['total_claims'] ?? 0,
      paidClaims: json['paid_claims'] ?? 0,
      totalPremiums: (json['total_premiums'] ?? 0).toDouble(),
      totalPayouts: (json['total_payouts'] ?? 0).toDouble(),
      activeZones: json['active_zones'] ?? 0,
    );
  }
}
