using Illus.Server.Domain;
using Microsoft.EntityFrameworkCore;

namespace Illus.Server.Sservices
{
    public class LoginService
    {
        private readonly IllusContext _illusContext;
        public LoginService(IllusContext illusContext)
        {
            _illusContext = illusContext;
        }

    }
}
