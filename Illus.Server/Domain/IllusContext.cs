using Illus.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Illus.Server.Domain
{
    public class IllusContext: DbContext
    {
        public IllusContext(DbContextOptions<IllusContext> options) : base(options) { }
        public DbSet<AdminModel> Admin { get; set; }
        public DbSet<ArtworkModel> Artwork { get; set; }
        public DbSet<ArtworkTagModel> ArtworkTags { get; set; }
        public DbSet<CountryModel> Country { get; set; }
        public DbSet<DailyThemeModel> DailyTheme { get; set; }
        public DbSet<FollowModel> Follow { get; set; }
        public DbSet<HistoryModel> History { get; set; }
        public DbSet<ImgModel> Img { get; set; }
        public DbSet<LanguageModel> Language { get; set; }
        public DbSet<LikeModel> Like { get; set; }
        public DbSet<MassageModel> Massage { get; set; }
        public DbSet<TagModel> Tag { get; set; }
        public DbSet<UserModel> User { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var mapper = new CoreMapper();

        }
    }
}
