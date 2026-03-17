import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/theme/theme.dart';
import '../../../../core/constants/constants.dart';
import '../../../../core/router/app_router.dart';

/// Zone selection screen with GPS
class ZoneScreen extends StatefulWidget {
  const ZoneScreen({super.key});

  @override
  State<ZoneScreen> createState() => _ZoneScreenState();
}

class _ZoneScreenState extends State<ZoneScreen> {
  String selectedZone = 'Andheri-East (Zone 3)';
  bool _gpsReady = false;
  bool _isGettingLocation = false;

  final List<Map<String, dynamic>> zones = [
    {'name': 'Andheri-East (Zone 3)', 'multiplier': 1.3, 'risk': 'High'},
    {'name': 'Koramangala (Zone 2)', 'multiplier': 1.1, 'risk': 'Medium'},
    {'name': 'Whitefield (Zone 7)', 'multiplier': 0.8, 'risk': 'Low'},
    {'name': 'Malad-West (Zone 5)', 'multiplier': 0.95, 'risk': 'Medium'},
    {'name': 'Indiranagar (Zone 1)', 'multiplier': 1.0, 'risk': 'Medium'},
    {'name': 'Thane-West (Zone 6)', 'multiplier': 1.2, 'risk': 'High'},
  ];

  void _getLocation() {
    setState(() => _isGettingLocation = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _gpsReady = true;
          _isGettingLocation = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.go(AppRoutes.profile),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress
              _buildProgress(3, 4),

              const SizedBox(height: 32),

              Text(
                AppStrings.zoneTitle,
                style: AppTypography.displaySmall,
              ).animate().fadeIn(duration: 300.ms),

              const SizedBox(height: 8),

              Text(
                AppStrings.zoneSubtitle,
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ).animate(delay: 100.ms).fadeIn(),

              const SizedBox(height: 24),

              // Zone dropdown
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: selectedZone,
                    isExpanded: true,
                    icon: const Icon(Icons.keyboard_arrow_down_rounded),
                    items: zones.map((zone) {
                      return DropdownMenuItem(
                        value: zone['name'] as String,
                        child: Row(
                          children: [
                            Icon(
                              Icons.location_on_rounded,
                              color: _getRiskColor(zone['risk'] as String),
                              size: 20,
                            ),
                            const SizedBox(width: 12),
                            Text(zone['name'] as String),
                          ],
                        ),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setState(() => selectedZone = value);
                      }
                    },
                  ),
                ),
              ).animate(delay: 200.ms).fadeIn(),

              const SizedBox(height: 24),

              // GPS Button
              GestureDetector(
                onTap: _isGettingLocation ? null : _getLocation,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: _gpsReady
                        ? AppColors.success.withOpacity(0.08)
                        : AppColors.primary.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _gpsReady
                          ? AppColors.success.withOpacity(0.3)
                          : AppColors.primary.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (_isGettingLocation)
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation(
                              AppColors.primary,
                            ),
                          ),
                        )
                      else
                        Icon(
                          _gpsReady ? Icons.check_circle : Icons.my_location,
                          color: _gpsReady
                              ? AppColors.success
                              : AppColors.primary,
                        ),
                      const SizedBox(width: 12),
                      Text(
                        _gpsReady
                            ? 'Location captured'
                            : 'Tap to capture GPS zone (one-time)',
                        style: AppTypography.labelLarge.copyWith(
                          color: _gpsReady
                              ? AppColors.success
                              : AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ).animate(delay: 300.ms).fadeIn(),

              if (_gpsReady) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppColors.success.withOpacity(0.2),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: AppColors.success,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Zone assigned via OSM Nominatim · Lat/Lng reverse-geocoded',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.success,
                          ),
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn().slideY(begin: 0.1),
              ],

              const Spacer(),

              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _gpsReady
                      ? () => context.go(AppRoutes.review)
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    disabledBackgroundColor: AppColors.border,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(
                    'Review Premium',
                    style: AppTypography.buttonLarge.copyWith(
                      color: _gpsReady
                          ? AppColors.white
                          : AppColors.textTertiary,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Color _getRiskColor(String risk) {
    switch (risk) {
      case 'High':
        return AppColors.danger;
      case 'Medium':
        return AppColors.warning;
      default:
        return AppColors.success;
    }
  }

  Widget _buildProgress(int current, int total) {
    return Row(
      children: List.generate(total, (index) {
        final isActive = index < current;
        return Expanded(
          child: Container(
            margin: EdgeInsets.only(right: index < total - 1 ? 8 : 0),
            height: 4,
            decoration: BoxDecoration(
              color: isActive ? AppColors.primary : AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        );
      }),
    );
  }
}
