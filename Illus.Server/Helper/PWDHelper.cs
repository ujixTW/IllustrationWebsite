using System.Security.Cryptography;
using System.Text;

namespace Illus.Server.Helper
{
    public class PWDHelper
    {
        /// <summary>
        /// 產生32bit隨機鹽
        /// </summary>
        /// <returns>bytes[]</returns>
        public static byte[] BuildNewSalt()
        {
            byte[] randBytes = new byte[32];
            new Random().NextBytes(randBytes);
            return randBytes;
        }
        /// <summary>
        /// 將密碼進行雜湊
        /// </summary>
        /// <param name="key">金鑰</param>
        /// <param name="pwd">密碼</param>
        /// <param name="salt">鹽</param>
        /// <returns></returns>
        public static byte[] GetHashPassword(string key, string pwd, byte[] salt)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] pwdBytes = Encoding.UTF8.GetBytes(pwd);
            byte[] totalBytes = salt.Union(pwdBytes).ToArray();

            HMACSHA512 hMACSHA512 = new HMACSHA512(keyBytes);
            byte[] hashPwd = hMACSHA512.ComputeHash(totalBytes);
            return hashPwd;
        }
    }
}
