using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Logic.Services
{
    public class EmailService
    {
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("MyApp", "no-reply@myapp.com"));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                // FakeSMTP vagy valós szerver adatai ide
                await client.ConnectAsync("localhost", 25, false);
                // Ha nem kell autentikáció, ezt hagyd ki:
                // await client.AuthenticateAsync("user", "password");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }
}
