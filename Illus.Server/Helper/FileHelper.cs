using System.Drawing;
namespace Illus.Server.Helper
{
    public class FileHelper
    {
        private static readonly string _basePath = "\\IllusWebsiteData\\";
        public enum imgType : int
        {
            Work = 0,
            WorkCover = 1,
            userCover = 2,
            UserHeadshot = 3,
        }
        public static bool IsImage(IFormFile file)
        {
            var contentTypes = new List<string> { "image/jpeg", "image/jpg", "image/png", };
            var fileType = file.ContentType;
            foreach (var contentType in contentTypes)
            {
                if (contentType == fileType) return true;
            }
            return false;
        }
        public static bool IsImage(List<IFormFile> files)
        {
            foreach (var file in files)
            {
                if (!IsImage(file)) return false;
            }
            return true;
        }
        /// <summary>
        /// 儲存圖片檔案
        /// </summary>
        /// <param name="file">檔案</param>
        /// <param name="id">作品/使用者Id</param>
        /// <param name="dataType">檔案類型</param>
        /// <returns></returns>
        public static async Task<string> SaveImageAsync(IFormFile file, int id, int dataType)
        {
            var extension = Path.GetExtension(file.FileName);
            var path = "";
            var fileNewName = "";
            switch (dataType)
            {
                case (int)imgType.WorkCover:
                    fileNewName = $"{id} cover{extension}";
                    path = $"{_basePath}\\Work\\img-costdown\\{fileNewName}";
                    break;
                case (int)imgType.userCover:
                    fileNewName = $"{id} user cover{extension}";
                    path = $"{_basePath}\\UserData\\Cover\\{fileNewName}";
                    break;
                case (int)imgType.UserHeadshot:
                    fileNewName = $"{id} user headshot{extension}";
                    path = $"{_basePath}\\UserData\\Headshot\\{fileNewName}";
                    break;
                default:
                    return path;
            }

            await SaveImageAsync(file, path);

            return path;
        }
        /// <summary>
        /// 儲存多張圖片檔案
        /// </summary>
        /// <param name="files">圖片清單</param>
        /// <param name="id">作品Id</param>
        /// <param name="dataType">檔案類型</param>
        /// <returns>檔案路徑清單</returns>
        public static async Task<List<string>> SaveImageAsync(List<IFormFile> files, int id, int dataType)
        {
            var pathList = new List<string>();
            switch (dataType)
            {
                case (int)imgType.Work:
                    for (var i = 0; i < files.Count; i++)
                    {
                        var extension = Path.GetExtension(files[i].FileName);
                        var fileNewName = $"{id} p{i}{extension}";
                        var path = $"{_basePath}\\Work\\img-master\\{fileNewName}";

                        await SaveImageAsync(files[i], path);

                        pathList.Add(path);
                    }
                    break;
                default:
                    return pathList;
            }
            return pathList;
        }
        private static async Task SaveImageAsync(IFormFile file, string path)
        {
            try
            {
                using (var stream = File.Create(path))
                {
                    await file.CopyToAsync(stream);
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("SaveImageAsync", ex);
            }

        }
    }
}
