<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table): void {
            $table->foreignId('subject_user_id')->nullable()->after('reporter_id')->constrained('users')->nullOnDelete();
            $table->text('subject_summary')->nullable();
            $table->timestamp('response_due_at')->nullable();
            $table->string('decision_action', 32)->nullable();
            $table->text('decision_reason')->nullable();
            $table->text('reporter_outcome_summary')->nullable();
            $table->boolean('decision_severe')->default(false);
            $table->timestamp('decided_at')->nullable();
            $table->timestamp('appeal_deadline_at')->nullable();
            $table->timestamp('appealed_at')->nullable();
            $table->timestamp('appeal_resolved_at')->nullable();
            $table->string('appeal_outcome', 24)->nullable();
            $table->text('appeal_reason')->nullable();
            $table->text('appeal_decision_reason')->nullable();
            $table->timestamp('emergency_hold_at')->nullable();
            $table->text('emergency_hold_reason')->nullable();
            $table->index(['subject_user_id', 'status']);
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->string('moderation_status', 24)->default('active')->index();
            $table->text('moderation_reason')->nullable();
            $table->foreignId('moderation_case_id')->nullable()->constrained('reports')->nullOnDelete();
            $table->timestamp('restricted_at')->nullable();
        });

        Schema::table('listings', function (Blueprint $table): void {
            $table->string('moderation_status', 24)->default('active')->index();
            $table->text('moderation_reason')->nullable();
            $table->foreignId('moderation_case_id')->nullable()->constrained('reports')->nullOnDelete();
            $table->timestamp('moderation_changed_at')->nullable();
        });

        Schema::create('report_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('report_id')->constrained()->cascadeOnDelete();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('event_type', 40);
            $table->string('visibility', 24)->default('admin_only');
            $table->text('body')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['report_id', 'created_at']);
        });

        // Existing reports are linked only when the other participant is unambiguous.
        DB::table('reports')->orderBy('id')->chunkById(200, function ($reports): void {
            foreach ($reports as $report) {
                $subjectId = null;
                if ($report->listing_id) {
                    $ownerId = DB::table('listings')->where('id', $report->listing_id)->value('owner_id');
                    if ($ownerId && (int) $ownerId !== (int) $report->reporter_id) {
                        $subjectId = $ownerId;
                    }
                } elseif ($report->claim_id) {
                    $claim = DB::table('claims')->where('id', $report->claim_id)->first(['listing_id', 'claimant_id']);
                    $ownerId = $claim ? DB::table('listings')->where('id', $claim->listing_id)->value('owner_id') : null;
                    if ($claim && $ownerId) {
                        if ((int) $report->reporter_id === (int) $claim->claimant_id) {
                            $subjectId = $ownerId;
                        } elseif ((int) $report->reporter_id === (int) $ownerId) {
                            $subjectId = $claim->claimant_id;
                        }
                    }
                }

                if ($subjectId) {
                    DB::table('reports')->where('id', $report->id)->update(['subject_user_id' => $subjectId]);
                }
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_events');
        Schema::table('listings', function (Blueprint $table): void {
            $table->dropForeign(['moderation_case_id']);
            $table->dropIndex(['moderation_status']);
            $table->dropColumn(['moderation_status', 'moderation_reason', 'moderation_case_id', 'moderation_changed_at']);
        });
        Schema::table('users', function (Blueprint $table): void {
            $table->dropForeign(['moderation_case_id']);
            $table->dropIndex(['moderation_status']);
            $table->dropColumn(['moderation_status', 'moderation_reason', 'moderation_case_id', 'restricted_at']);
        });
        Schema::table('reports', function (Blueprint $table): void {
            $table->dropForeign(['subject_user_id']);
            $table->dropIndex(['subject_user_id', 'status']);
            $table->dropColumn([
                'subject_user_id', 'subject_summary', 'response_due_at', 'decision_action', 'decision_reason',
                'reporter_outcome_summary', 'decision_severe', 'decided_at', 'appeal_deadline_at', 'appealed_at',
                'appeal_resolved_at', 'appeal_outcome', 'appeal_reason', 'appeal_decision_reason',
                'emergency_hold_at', 'emergency_hold_reason',
            ]);
        });
    }
};
