using API.Helpers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel;
using System.Linq;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseApiController<T> : ControllerBase 
    {
        public static string Name => typeof(T).Name.Replace("Controller", "");
    }
}