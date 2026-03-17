import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/theme/theme.dart';

/// Policy details screen
class PolicyScreen extends StatelessWidget {
  const PolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Active Policy', style: AppTypography.displaySmall),
              const SizedBox(height: 8),
              Text(
                'Your coverage details and risk profile',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),

              const SizedBox(height: 24),

              // Shield status card
              Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Days remaining ring
                        SizedBox(
                          width: 120,
                          height: 120,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              SizedBox(
                                width: 120,
                                height: 120,
                                child: CircularProgressIndicator(
                                  value: 4 / 7,
                                  strokeWidth: 8,
                                  backgroundColor: AppColors.white.withOpacity(
                                    0.2,
                                  ),
                                  valueColor: AlwaysStoppedAnimation(
                                    AppColors.white,
                                  ),
                                ),
                              ),
                              Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    '4',
                                    style: AppTypography.displayLarge.copyWith(
                                      color: AppColors.white,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                  Text(
                                    'days left',
                                    style: AppTypography.labelSmall.copyWith(
                                      color: AppColors.white.withOpacity(0.8),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 20),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: AppColors.white,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'SHIELD ACTIVE',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.white,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  )
                  .animate()
                  .fadeIn(duration: 400.ms)
                  .scale(begin: const Offset(0.95, 0.95)),

              const SizedBox(height: 24),

              // Policy details
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    _buildDetailRow('Zone', 'Andheri-East (Zone 3)'),
                    _buildDivider(),
                    _buildDetailRow('Premium', '₹149 / week'),
                    _buildDivider(),
                    _buildDetailRow('Coverage', '₹300 / event'),
                    _buildDivider(),
                    _buildDetailRow('Renews', 'Sun, Mar 22, 2026'),
                    _buildDivider(),
                    _buildDetailRow(
                      'Policy Hash',
                      '0xa3f1...c8d2',
                      isMono: true,
                    ),
                  ],
                ),
              ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.1),

              const SizedBox(height: 24),

              // Live triggers section
              Text('Live Trigger Monitor', style: AppTypography.titleLarge),
              const SizedBox(height: 4),
              Text(
                'Updated 3 min ago',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.success,
                ),
              ),

              const SizedBox(height: 16),

              _buildTriggerItem(
                Icons.water_drop_rounded,
                'Rainfall - Zone 3',
                'Current: 4.2mm/hr | Threshold: 15mm/hr',
                'OK',
                AppColors.success,
                0,
              ),
              _buildTriggerItem(
                Icons.thermostat_rounded,
                'Temperature - Zone 3',
                'Current: 38°C | Threshold: 42°C',
                'WATCH',
                AppColors.warning,
                1,
              ),
              _buildTriggerItem(
                Icons.air_rounded,
                'AQI - Andheri-East',
                'Current: AQI 187 | Threshold: 300',
                'OK',
                AppColors.success,
                2,
              ),
              _buildTriggerItem(
                Icons.newspaper_rounded,
                'News / Strike Monitor',
                'No curfew keywords in last 6 hours',
                'CLEAR',
                AppColors.success,
                3,
              ),
              _buildTriggerItem(
                Icons.trending_down_rounded,
                'Zone Activity Index',
                'Current: 78% baseline | Threshold: 30%',
                'NORMAL',
                AppColors.success,
                4,
              ),

              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isMono = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          Text(
            value,
            style: isMono
                ? AppTypography.monoSmall.copyWith(color: AppColors.success)
                : AppTypography.titleSmall,
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(color: AppColors.border, height: 1);
  }

  Widget _buildTriggerItem(
    IconData icon,
    String title,
    String subtitle,
    String status,
    Color statusColor,
    int index,
  ) {
    return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Icon(icon, color: AppColors.textSecondary, size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: AppTypography.titleSmall),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textTertiary,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  status,
                  style: AppTypography.labelSmall.copyWith(
                    color: statusColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        )
        .animate(delay: Duration(milliseconds: 300 + (index * 80)))
        .fadeIn()
        .slideX(begin: 0.05);
  }
}
