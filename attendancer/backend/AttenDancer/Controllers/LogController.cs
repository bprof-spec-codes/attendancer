using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class LogController : ControllerBase
{
    private readonly string LogFilePath;

    public LogController()
    {
        // A log mappát beállítani.
        LogFilePath = Path.Combine(Directory.GetCurrentDirectory(), "logs", "logs.txt");
    }

    [HttpPost]
    public async Task<IActionResult> Log([FromBody] LogMessage logMessage)
    {
        // Mappa létezésének biztosítása.
        var logDirectory = Path.GetDirectoryName(LogFilePath);
        if (!Directory.Exists(logDirectory))
        {
            Directory.CreateDirectory(logDirectory);
        }

        // A log fájlba írása.
        await System.IO.File.AppendAllTextAsync(LogFilePath, logMessage.Message + "\n");
        return Ok("Log saved.");
    }
}

public class LogMessage
{
    public string Message { get; set; }
}
