#
# Cookbook Name:: nodejs
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

$user = node['nvm']['user']
$group = node['nvm']['group'] || $user
$home = node['nvm']['home'] || "/home/#{$user}"

package "git" do
  action [:install]
end

execute "install-nvm" do
  user $user
  group $group
  cwd $home

  command <<-EOF
if [ ! -d #{$home}/.nvm ]; then
    git clone git://github.com/creationix/nvm.git #{$home}/.nvm
fi

grep nvm.sh #{$home}/.bashrc
if [ $? -eq 1 ]; then
    echo -e '[[ -s "#{$home}/.nvm/nvm.sh" ]] && . "#{$home}/.nvm/nvm.sh"' >> #{$home}/.bashrc
    . #{$home}/.nvm/nvm.sh
fi
  EOF
  notifies :run, "execute[install-nodes]", :immediately
  not_if "test -d #{$home}/.nvm"
end

execute "install-nodes" do
  user $user
  group $group
  cwd $home

  @all_node_versions = Array(node['nvm']['node_versions'])
  @install_command = @all_node_versions.map { |v| "nvm install #{v}"}.join("\n").strip

  command <<-EOF
    . #{$home}/.nvm/nvm.sh
    #{@install_command}
EOF

  if node['nvm']['default_node_version'] || @all_node_versions.count > 0
    notifies :run, "execute[make-default-node-version]", :immediately
  end
end

execute "make-default-node-version" do
  user $user
  group $group
  cwd $home

  @default_node_version = node['nvm']['default_node_version'] || Array(node['nvm']['node_versions']).first
  command <<-EOF
    . #{$home}/.nvm/nvm.sh
    nvm alias default #{@default_node_version}
EOF

  if node['nvm']['default_npm_modules']
    notifies :run, "execute[install-default-npm-modules]", :immediately
  end
end

execute "install-default-npm-modules" do
  user $user
  group $group
  cwd $home
  environment ({ 'HOME' => $home })

  @npm_modules = Array(node['nvm']['default_npm_modules']).join(" ")
  command <<-EOF
    . #{$home}/.nvm/nvm.sh
    npm install -g #{@npm_modules}
EOF
  action :run
end
