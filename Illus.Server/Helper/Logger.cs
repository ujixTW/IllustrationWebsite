namespace Illus.Server.Helper
{
    public class Logger
    {
        private static readonly string _savePath = "C:\\Logs\\IllusWebLog.log";
        /// <summary>
        /// 記錄錯誤
        /// </summary>
        /// <param name="moduleName">目標節點</param>
        /// <param name="ex">錯誤</param>
        public static void WriteLog(string moduleName, Exception ex)
        {
            string content =
$@"
{DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")}
    {moduleName}
    {ex.ToString()}
";

            File.AppendAllText(Logger._savePath, content);
        }
    }
}
