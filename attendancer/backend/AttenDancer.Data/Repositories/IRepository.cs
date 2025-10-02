using AttenDancer.Entity.Helpers;
using System.Linq;
using System.Threading.Tasks;

namespace AttenDancer.Data.Repositories
{
    public interface IRepository<T> where T : class, IIdEntity
    {
        Task<T> Create(T entity);
        Task DeleteById(string id);
        Task<T?> GetOne(string id);
        IQueryable<T> GetAll();
        Task<T> Update(T entity);
    }
}