using AttenDancer.Entities;
using AttenDancer.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AttenDancer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController(IRepository<Employee> EmployeeRepository) : ControllerBase
{
    private IRepository<Employee> EmployeeRepository = EmployeeRepository;

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        return Ok(EmployeeRepository.GetAll());
    }
}