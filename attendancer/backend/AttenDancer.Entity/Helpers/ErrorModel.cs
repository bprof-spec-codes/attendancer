using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Helpers
{
    public class ErrorModel
    {
        public string ErrorMessage { get; set; }
        public ErrorModel(string errorMessage)
        {
            ErrorMessage = errorMessage;
        }
    }
}
