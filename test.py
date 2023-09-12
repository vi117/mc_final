import smtplib
from email.mime.text import MIMEText

# send mail

smtp = smtplib.SMTP('prelude.duckdns.org', 1025)

smtp.ehlo()

smtp.login('no-reply', 'no-reply')

msg = MIMEText("""
<h1>prelude</h1>
<pre>
asdfwerDHJTEST
</pre>
""")
msg['Subject'] = 'prelude'
msg['From'] = 'no-reply'
msg['To'] = 'monoid@prelude.duckdns.org'
msg['Content-Type'] = 'text/html'

smtp.sendmail('prelude', 'prelude', msg.as_string())

smtp.quit()
