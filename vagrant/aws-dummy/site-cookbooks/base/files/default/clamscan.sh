#!/bin/sh

echo "----"
echo "start clamscan `date`"

clamscan_logfile="/var/log/clamav/clamscan.log"

mail_from="clamscan@tamadev.com"
mail_to="nomoto@ubicast.com"

result=`nice -n 10 clamscan -i -r -l $clamscan_logfile --exclude-dir="(/dev|/sys|/usr/share/doc/clamav-[0-9\.]+/test)" / | grep FOUND | wc -l`
echo "FOUNDED : $result"

if [ $result -gt 0 ]; then
    echo "infected!!"
    public_hostname=`curl -s http://169.254.169.254/latest/meta-data/public-hostname`
    sendmail -f $mail_form $mail_to <<EOF
From: $mail_from
To: $mail_to
Subject: clamscan found infected

public_hostname : $public_hostname
infected : $result
EOF
fi

echo "finish clamscan. see details $clamscan_logfile"
