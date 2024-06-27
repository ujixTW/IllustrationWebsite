using Illus.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Illus.Server.Domain
{
    public class IllusContext: DbContext
    {
        public IllusContext(DbContextOptions<IllusContext> options) : base(options) { }
        public DbSet<AdminModel> Admin { get; set; }
        public DbSet<ArtworkModel> Artwork { get; set; }
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
        public DbSet<LoginTokenModel> LoginToken { get; set; }
        public DbSet<GotchaModel> Gotcha { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var mapper = new CoreMapper();
            modelBuilder.Entity<AdminModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<ArtworkModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<CountryModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<DailyThemeModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<FollowModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<HistoryModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<ImgModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<LanguageModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<LikeModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<MassageModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<TagModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<UserModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<LoginTokenModel>(entity => mapper.Map(entity));
            modelBuilder.Entity<GotchaModel>(entity => mapper.Map(entity));
        }
    }
}
