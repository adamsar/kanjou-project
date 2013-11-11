#
# Cookbook Name:: basic
# Recipe:: default
#
# Copyright 2013, Example Com
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

file '/etc/localtime' do
  action :delete
  only_if { ::File.exists?('/etc/localtime') && !::File.symlink?('/etc/localtime') }
end

link '/etc/localtime' do
  filename = "/usr/share/zoneinfo/Asia/Tokyo"
  to filename
  not_if { ::File.symlink?('/etc/localtime') && ::File.readlink('/etc/localtime') == filename }
end

#execute "yum update -y"
execute "devtools" do
  user "root"
  command 'yum -y groupinstall "Development Tools"'
  action :run
end

packages = [
  "gcc", "gcc-c++", "libxml2", "make", "git", "automake", "autoconf",
  "ntp",
  "ack",
  "dstat",
  "emacs",
  "tmux",
  "multitail",
  "rsyslog",
  "tree",
  "telnet",
  "mysql",
  "mysql-devel",
  "openssl",
  "openssl-devel",
  "zlib-devel",
  "perl-devel",
  "libxml2-devel",
  "libxslt-devel",
  "s3cmd"
]
packages.each do |pkg|
  package pkg do
    action :install
    options '--enablerepo=epel'
  end
end

service "ntpd" do
  action [:start, :enable]
end

gem_package "aws-sdk" do
  action :install
end

# create swap file for t1.micro
bash 'create swapfile' do
  code <<-EOC
    dd if=/dev/zero of=/swap.img bs=1M count=2048 &&
    chmod 600 /swap.img
    mkswap /swap.img
  EOC
  only_if { not node[:ec2].nil? and node[:ec2][:instance_type] == 't1.micro' }
  creates "/swap.img"
end

mount '/dev/null' do
  action :enable
  device '/swap.img'
  fstype 'swap'
  only_if { not node[:ec2].nil? and node[:ec2][:instance_type] == 't1.micro' }
end

bash 'activate swap' do
  code 'swapon -ae'
  only_if "test `cat /proc/swaps | wc -l` -eq 1"
end

# cron "clamscan_daily" do
#   hour "4"
#   minute "0"
#   command "sh /root/batch/clamscan.sh >> /root/batch/log/clamscan.log 2>&1"
#   user "root"
#   action :create
#   only_if { ::File.exists?('/root/batch/clamscan.sh') }
# end


