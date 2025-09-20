using AttenDancer.Entities;

namespace AttenDancer.Repositories;

public interface IRepository<T> where T : class, IEntity
{
    Task<T> Create(T entity);
    Task DeleteById(int id);
    Task<T> GetOne(int id);
    IQueryable<T> GetAll();
    Task<T> Update(T entity);
}
