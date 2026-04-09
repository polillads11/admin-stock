<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendBirthdayNotificationsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send-birthday';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send birthday notifications to users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $job = new \App\Jobs\SendBirthdayNotifications();
        $job->handle();

        $this->info('Birthday notifications sent successfully.');
    }
}
