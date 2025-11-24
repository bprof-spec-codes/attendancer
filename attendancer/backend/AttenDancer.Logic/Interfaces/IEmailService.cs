using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Logic.Interfaces
{
    public interface IEmailService
    {
        Task SendTemplateEmailAsync(string to, string subject, string templateName, Dictionary<string, string> placeholders);
    }
}
