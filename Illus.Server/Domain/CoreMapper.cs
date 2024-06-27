using Illus.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Illus.Server.Domain
{
    public class CoreMapper
    {
        public void Map(EntityTypeBuilder<AdminModel> entity)
        {
            entity.ToTable("Admin");
            entity.HasKey(p => p.Id);
        }
        public void Map(EntityTypeBuilder<ArtworkModel> entity)
        {
            entity.ToTable("Artwork");
            entity.HasKey(p => p.Id);
            entity.HasMany(p => p.Tags).WithMany(p => p.Artworks).UsingEntity("ArtworkTag");
        }
        public void Map(EntityTypeBuilder<CountryModel> entity)
        {
            entity.ToTable("Country");
            entity.HasKey(p => p.Id);
        }
        public void Map(EntityTypeBuilder<DailyThemeModel> entity)
        {
            entity.ToTable("DailyTheme");
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.Tag).WithMany();
            entity.HasOne(p => p.Admin).WithMany();
        }
        public void Map(EntityTypeBuilder<FollowModel> entity)
        {
            entity.ToTable("Follow");
            entity.HasKey(p => new { p.FollowingId, p.FollowerId });
            entity.HasOne(p => p.Follower).WithMany();
            entity.HasOne(p => p.Following).WithMany().OnDelete(DeleteBehavior.ClientCascade);
        }
        public void Map(EntityTypeBuilder<HistoryModel> entity)
        {
            entity.ToTable("History");
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.User).WithMany();
            entity.HasOne(p => p.Artwork).WithMany();
        }
        public void Map(EntityTypeBuilder<ImgModel> entity)
        {
            entity.ToTable("Img");
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.Artwork).WithMany(p => p.Images);
        }
        public void Map(EntityTypeBuilder<LanguageModel> entity)
        {
            entity.ToTable("Language");
            entity.HasKey(p => p.Id);
        }
        public void Map(EntityTypeBuilder<LikeModel> entity)
        {
            entity.ToTable("Like");
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.User).WithMany().OnDelete(DeleteBehavior.ClientCascade);
            entity.HasOne(p => p.Artwork).WithMany(p => p.Likes);
        }
        public void Map(EntityTypeBuilder<MassageModel> entity)
        {
            entity.ToTable("Massage");
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.Artwork).WithMany().OnDelete(DeleteBehavior.ClientCascade);
            entity.HasOne(p => p.User).WithMany();
        }
        public void Map(EntityTypeBuilder<TagModel> entity)
        {
            entity.ToTable("Tag");
            entity.HasKey(p => p.Id);
        }
        public void Map(EntityTypeBuilder<UserModel> entity)
        {
            entity.ToTable("User");
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.Language).WithMany().OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(p => p.Country).WithMany().OnDelete(DeleteBehavior.NoAction);
        }
        public void Map(EntityTypeBuilder<LoginTokenModel> entity)
        {
            entity.ToTable("LoginToken");
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.User).WithMany(p => p.LoginTokens);
        }
        public void Map(EntityTypeBuilder<GotchaModel> entity)
        {
            entity.ToTable("Gotcha");
            entity.HasKey(p => p.UserId);
            entity.HasOne(p => p.User).WithOne(p => p.Gotcha);
        }
    }
}
