using AttenDancer.Logic.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;

namespace AttenDancer.Logic.Services
{
    public class EmailService : IEmailService
    {

        private readonly IHostEnvironment _env;

        public EmailService(IHostEnvironment env)
        {
            _env = env;
        }
        public async Task SendTemplateEmailAsync(string to, string subject, string templateName, Dictionary<string, string> placeholders)
        {

            var templatePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", $"{templateName}.html");
            var html = await File.ReadAllTextAsync(templatePath);

            foreach (var (key, value) in placeholders)
            {
                html = html.Replace("{{" + key + "}}", value);
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("MyApp", "no-reply@myapp.com"));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = html };

            using var client = new SmtpClient();
            await client.ConnectAsync("localhost", 25, false);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
