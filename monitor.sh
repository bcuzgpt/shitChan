#!/bin/bash

# Exit on error
set -e

# Configuration
LOG_DIR="/var/log/shitchan"
MONITOR_LOG="$LOG_DIR/monitor.log"
ERROR_THRESHOLD=5
CHECK_INTERVAL=60

# Create log directory if it doesn't exist
mkdir -p $LOG_DIR

# Function to check service status
check_service() {
    local service=$1
    if ! systemctl is-active --quiet $service; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - $service is not running" >> $MONITOR_LOG
        systemctl restart $service
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Attempted to restart $service" >> $MONITOR_LOG
    fi
}

# Function to check disk space
check_disk_space() {
    local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $usage -gt 90 ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Disk usage is above 90%" >> $MONITOR_LOG
    fi
}

# Function to check error logs
check_error_logs() {
    local error_count=$(tail -n 100 $LOG_DIR/error.log | grep -c "ERROR")
    if [ $error_count -gt $ERROR_THRESHOLD ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - High number of errors detected: $error_count" >> $MONITOR_LOG
    fi
}

# Main monitoring loop
while true; do
    check_service nginx
    check_service shitchan
    check_disk_space
    check_error_logs
    sleep $CHECK_INTERVAL
done 