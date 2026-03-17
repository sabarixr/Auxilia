import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../core/theme/theme.dart';
import '../../../../core/router/app_router.dart';

/// Policy review and payment screen
class ReviewScreen extends StatefulWidget {
  const ReviewScreen({super.key});

  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> {
  bool _isProcessing = false;

  // Mock premium calculation
  final int basePremium = 99;
  final double multiplier = 1.3;
  final int addOn = 20;

  int get total => (basePremium * multiplier + addOn).round();

  void _processPayment() async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      context.go(AppRoutes.success);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.go(AppRoutes.zone),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress
              _buildProgress(4, 4),

              const SizedBox(height: 32),

              Text(
                'Your Weekly Policy',
                style: AppTypography.displaySmall,
              ).animate().fadeIn(duration: 300.ms),

              const SizedBox(height: 8),

              Text(
                'Dynamic premium based on your zone risk score',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ).animate(delay: 100.ms).fadeIn(),

              const SizedBox(height: 32),

              // Premium breakdown card
              Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          AppColors.warning.withOpacity(0.1),
                          AppColors.warning.withOpacity(0.05),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: AppColors.warning.withOpacity(0.2),
                      ),
                    ),
                    child: Column(
                      children: [
                        _buildPremiumRow('Base premium', '₹$basePremium'),
                        const Divider(height: 24),
                        _buildPremiumRow(
                          'Zone risk multiplier (Andheri)',
                          '×${multiplier.toStringAsFixed(1)}',
                        ),
                        const Divider(height: 24),
                        _buildPremiumRow(
                          'Predictive add-on (7-day forecast)',
                          '+ ₹$addOn',
                        ),
                        const Divider(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Total / week',
                              style: AppTypography.titleMedium.copyWith(
                                color: AppColors.warning,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            Text(
                              '₹$total',
                              style: AppTypography.displaySmall.copyWith(
                                color: AppColors.warning,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  )
                  .animate(delay: 200.ms)
                  .fadeIn()
                  .scale(begin: const Offset(0.95, 0.95)),

              const SizedBox(height: 24),

              // Benefits card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Column(
                  children: [
                    _buildBenefitRow(
                      Icons.autorenew,
                      'Auto-renews every Sunday via Razorpay',
                    ),
                    const SizedBox(height: 12),
                    _buildBenefitRow(
                      Icons.shield,
                      'Claim up to ₹300 per disruption event',
                    ),
                    const SizedBox(height: 12),
                    _buildBenefitRow(
                      Icons.verified,
                      'Policy hash stored on blockchain',
                    ),
                  ],
                ),
              ).animate(delay: 300.ms).fadeIn(),

              const Spacer(),

              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isProcessing ? null : _processPayment,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _isProcessing
                      ? Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation(
                                  AppColors.white,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Processing on blockchain...',
                              style: AppTypography.buttonMedium.copyWith(
                                color: AppColors.white,
                              ),
                            ),
                          ],
                        )
                      : Text(
                          'Pay ₹$total via Razorpay',
                          style: AppTypography.buttonLarge.copyWith(
                            color: AppColors.white,
                          ),
                        ),
                ),
              ).animate(delay: 400.ms).fadeIn(),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPremiumRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTypography.bodySmall.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: AppTypography.labelLarge.copyWith(
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildBenefitRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.primary),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: AppTypography.bodySmall.copyWith(color: AppColors.primary),
          ),
        ),
      ],
    );
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
