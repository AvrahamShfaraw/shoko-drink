using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Api.Services
{
    public class EmailService
    {
        private readonly string serviceId = "service_trnjjrq";       // from EmailJS
        private readonly string templateId = "template_ofabnj6";     // from EmailJS
        private readonly string publicKey = "EZCFl69T0Svvkvzz8";       // from EmailJS

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using var client = new HttpClient();

            var payload = new
            {
                service_id = serviceId,
                template_id = templateId,
                user_id = publicKey,
                template_params = new
                {
                    to_email = toEmail,
                    subject = subject,
                    message = body
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("https://api.emailjs.com/api/v1.0/email/send", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"EmailJS failed to send email: {error}");
            }
        }
    }
}
