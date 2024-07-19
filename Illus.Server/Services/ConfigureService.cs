using Illus.Server.Models.Env;

namespace Illus.Server.Services
{
    public class ConfigureService
    {
        public static EmailEnvOption? GetWebsiteEmail()
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            return config.GetSection(EmailEnvOption.WebsiteEmail).Get<EmailEnvOption>();
        }
    }
}
