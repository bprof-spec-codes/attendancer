using AttenDancer.Data;
using AttenDancer.Entities;
using Microsoft.EntityFrameworkCore;

namespace AttenDancer.Repositories;

public class Repository<T> : IRepository<T> where T : class, IEntity
{
    private AttenDancerDbContext Context { get; set; }
    private DbSet<T> Entities { get; set; }

    public Repository(AttenDancerDbContext Context)
    {
        this.Context = Context;
        Entities = this.Context.Set<T>();
    }

    public async Task<T> Create(T entity)
    {
        await Entities.AddAsync(entity);
        Context.SaveChanges();
        return entity;
    }

    public async Task DeleteById(int id)
    {
        T entity = await GetOne(id);
        Entities.Remove(entity);
        Context.SaveChanges();
    }

    public IQueryable<T> GetAll()
    {
        return Entities;
    }

    public async Task<T> GetOne(int id)
    {
        var entity = await Entities.FirstOrDefaultAsync(e => e.Id == id);
        return entity;
    }

    public async Task<T> Update(T entity)
    {
        var oldEntity = await GetOne(entity.Id);
        foreach (var prop in oldEntity.GetType().GetProperties())
        {
            prop.SetValue(oldEntity, prop.GetValue(entity));
        }
        Context.SaveChanges();
        return entity;
    }
}
