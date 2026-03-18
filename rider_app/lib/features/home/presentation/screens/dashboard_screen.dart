import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/providers/providers.dart';
import '../../../../core/theme/theme.dart';
import '../../../../shared/models/models.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final riderAsync = ref.watch(currentRiderProvider);
    final policyAsync = ref.watch(activePolicyProvider);
    final claimsSummaryAsync = ref.watch(claimsSummaryProvider);
    final triggersAsync = ref.watch(triggersProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(currentRiderProvider);
            ref.invalidate(activePolicyProvider);
            ref.invalidate(claimsSummaryProvider);
            ref.invalidate(triggersProvider);
          },
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              riderAsync
                  .when(
                    data: (rider) {
                      final name = rider?.name.split(' ').first ?? 'Rider';
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Hi, $name', style: AppTypography.displaySmall),
                          const SizedBox(height: 8),
                          Text(
                            'Your parametric shield is watching the road in real time.',
                            style: AppTypography.bodyMedium.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      );
                    },
                    loading: () => const _HeaderSkeleton(),
                    error: (_, _) => Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Welcome back', style: AppTypography.displaySmall),
                        const SizedBox(height: 8),
                        Text(
                          'Connect the backend to see your live rider profile.',
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  )
                  .animate()
                  .fadeIn(),
              const SizedBox(height: 24),
              policyAsync.when(
                data: (policy) =>
                    _ShieldCard(daysLeft: policy?.daysRemaining ?? 0),
                loading: () => const _CardSkeleton(height: 220),
                error: (_, _) => const _EmptyCard(
                  title: 'No active policy yet',
                  subtitle: 'Finish onboarding to activate your coverage.',
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: claimsSummaryAsync.when(
                      data: (summary) => _MetricCard(
                        title: 'Paid Claims',
                        value: '${summary['paid'] ?? 0}',
                        accent: AppColors.success,
                      ),
                      loading: () => const _CardSkeleton(height: 110),
                      error: (_, _) => const _MetricCard(
                        title: 'Paid Claims',
                        value: '0',
                        accent: AppColors.success,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: claimsSummaryAsync.when(
                      data: (summary) => _MetricCard(
                        title: 'Protected',
                        value:
                            'Rs ${((summary['amount'] ?? 0) as num).toStringAsFixed(0)}',
                        accent: AppColors.primary,
                      ),
                      loading: () => const _CardSkeleton(height: 110),
                      error: (_, _) => const _MetricCard(
                        title: 'Protected',
                        value: 'Rs 0',
                        accent: AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text('Live trigger monitor', style: AppTypography.titleLarge),
              const SizedBox(height: 8),
              Text(
                'Weather, traffic, and incident signals from your zone.',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 16),
              triggersAsync.when(
                data: (triggers) {
                  if (triggers.isEmpty) {
                    return const _EmptyCard(
                      title: 'No active zone signals',
                      subtitle:
                          'Once trigger checks run, they will appear here.',
                    );
                  }

                  return Column(
                    children: triggers
                        .map(
                          (trigger) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: _TriggerCard(trigger: trigger),
                          ),
                        )
                        .toList(),
                  );
                },
                loading: () => const _CardSkeleton(height: 200),
                error: (_, _) => const _EmptyCard(
                  title: 'Trigger feed unavailable',
                  subtitle: 'Start the backend to load live monitoring data.',
                ),
              ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }
}

class _ShieldCard extends StatelessWidget {
  final int daysLeft;

  const _ShieldCard({required this.daysLeft});

  @override
  Widget build(BuildContext context) {
    final progress = daysLeft <= 0 ? 0.0 : (daysLeft.clamp(0, 30) / 30);

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.24),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          SizedBox(
            width: 120,
            height: 120,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: progress,
                  strokeWidth: 8,
                  backgroundColor: AppColors.white.withOpacity(0.2),
                  valueColor: const AlwaysStoppedAnimation(AppColors.white),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '$daysLeft',
                      style: AppTypography.displayLarge.copyWith(
                        color: AppColors.white,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    Text(
                      'days left',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.white.withOpacity(0.84),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.white.withOpacity(0.16),
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(
              daysLeft > 0 ? 'SHIELD ACTIVE' : 'RENEW REQUIRED',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.white,
                fontWeight: FontWeight.w700,
                letterSpacing: 1,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;
  final Color accent;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.accent,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: AppTypography.displaySmall.copyWith(
              color: accent,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }
}

class _TriggerCard extends StatelessWidget {
  final TriggerStatusModel trigger;

  const _TriggerCard({required this.trigger});

  @override
  Widget build(BuildContext context) {
    final color = trigger.isActive ? AppColors.warning : AppColors.success;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.sensors_rounded, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  trigger.triggerType.toUpperCase(),
                  style: AppTypography.titleSmall,
                ),
                const SizedBox(height: 4),
                Text(
                  'Current ${trigger.currentValue.toStringAsFixed(1)} / Threshold ${trigger.threshold.toStringAsFixed(1)}',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              trigger.statusLabel,
              style: AppTypography.labelSmall.copyWith(
                color: color,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyCard extends StatelessWidget {
  final String title;
  final String subtitle;

  const _EmptyCard({required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTypography.titleSmall),
          const SizedBox(height: 6),
          Text(
            subtitle,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _CardSkeleton extends StatelessWidget {
  final double height;

  const _CardSkeleton({required this.height});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
      ),
    );
  }
}

class _HeaderSkeleton extends StatelessWidget {
  const _HeaderSkeleton();

  @override
  Widget build(BuildContext context) {
    return const _CardSkeleton(height: 70);
  }
}
