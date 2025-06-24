using System.Linq.Expressions;
using Domain.Repository;
using FrameworksDevices.Data;
using Microsoft.EntityFrameworkCore;

namespace FrameworksDevices.Repository;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly WalletDbContext _context;

    public GenericRepository(WalletDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
    }

    public void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _context.Set<T>().Where(predicate).ToListAsync();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _context.Set<T>().ToListAsync();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public void Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }
}