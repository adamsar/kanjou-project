require 'rubygems'
require 'aws-sdk'
require 'optparse'

opt = OptionParser.new
OPTS = {}
opt.on('-e ELB_NAME') {|v| OPTS[:elb_name] = v}
opt.on('-i INSTANCE_ID') {|v| OPTS[:instance_id] = v}
opt.parse!(ARGV)

unless OPTS[:elb_name]
  puts "please setting -e [elb_name]"
  exit 1
end

AWS.config({
  :ec2_endpoint => 'ec2.ap-northeast-1.amazonaws.com',
  :elb_endpoint =>'elasticloadbalancing.ap-northeast-1.amazonaws.com'
})
elb = AWS::ELB.new.load_balancers[OPTS[:elb_name]]
cluster_urls = elb.instances.select { |i|
  (OPTS[:instance_id]) ? OPTS[:instance_id] != i.instance_id : i
}.map { |i|
  i.public_dns_name
}.join("\n")

puts "http://#{cluster_urls}/"
