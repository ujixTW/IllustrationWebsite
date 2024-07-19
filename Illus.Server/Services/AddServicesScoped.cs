using Illus.Server.Services.Admin;
using Illus.Server.Sservices.Account;
using Illus.Server.Sservices.Admin;
using Illus.Server.Sservices.Works;

namespace Illus.Server.Services
{
    public class AddServicesScoped
    {
        public static void AddScopeds(IServiceCollection services)
        {
            services.AddScoped<LoginService>();
            services.AddScoped<EditAccountService>();
            services.AddScoped<FollowService>();
            services.AddScoped<WorkService>();
            services.AddScoped<MessageService>();
            services.AddScoped<AdminAccountService>();
            services.AddScoped<AdminLoginService>();
            services.AddScoped<AdminWorkService>();
        }
    }
}
