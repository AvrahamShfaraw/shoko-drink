using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Data;
using Api.Domain;
using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly TokenService _tokenService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(DataContext context, TokenService tokenService, ILogger<AccountController> logger)
        {
            _logger = logger;
            _context = context;
            _tokenService = tokenService;

        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync((u) => u.PhoneNumber == loginDto.PhoneNumber);

            if (user == null)
            {

                return BadRequest("מספר הטלפון לא קיים. אנא הירשם.");

            }

            var image = await _context.Photos.FindAsync(user.ImageId);

            if (image != null)
            {
                user.Image = image;
            }

            return CreateUserObject(user);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            var userExists = await _context.Users.AnyAsync(x => x.PhoneNumber == registerDto.PhoneNumber);
            _logger.LogInformation($"#!! User Exists: {userExists}"); //  #!! User Exists: True

            if (userExists)
            {
                return BadRequest("המספר טלפון כבר קיים במערכת. אנא היכנס לחשבונך.");

            }

            var user = new UserApp
            {
                PhoneNumber = registerDto.PhoneNumber,
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                Role = registerDto.Role
            };

            await _context.Users.AddAsync(user);

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                var image = await _context.Photos.FindAsync(user.ImageId);

                if (image != null)
                {
                    user.Image = image;
                }

                return CreateUserObject(user);
            }

            return BadRequest("Faill to create user");
        }

        [AllowAnonymous]
        [HttpPost("googleSignin")]
        public async Task<ActionResult<UserDto>> GoogleSignin(RegisterDto registerDto)
        {

            var user = await _context.Users.FirstOrDefaultAsync(x => x.PhoneNumber == registerDto.PhoneNumber);
            _logger.LogInformation($"#!! User Exists: {user}"); //  #!! User Exists: True

            if (user != null)
            {
                return CreateUserObject(user);

            }

            user = new UserApp
            {
                PhoneNumber = registerDto.PhoneNumber,
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                Role = registerDto.Role,
                Image = new Photo
                {
                    Id = Guid.NewGuid().ToString(),
                    Url = registerDto.Image,
                    IsMain = true


                }
            };

            await _context.Users.AddAsync(user);

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                var image = await _context.Photos.FindAsync(user.ImageId);

                if (image != null)
                {
                    user.Image = image;
                }

                return CreateUserObject(user);
            }

            return BadRequest("Faill to create user");
        }


        [HttpPost("update")]
        public async Task<ActionResult<UserDto>> Update(RegisterDto updateDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == updateDto.PhoneNumber);

            if (user == null)
            {
                return BadRequest("מספר הטלפון לא קיים.");
            }

            user.Email = updateDto.Email;
            user.DisplayName = updateDto.DisplayName;

            

            _context.Entry(user).State = EntityState.Modified;

            var success = await _context.SaveChangesAsync() > 0;

            if (!success)
            {
                return BadRequest("משהו לא בסדר בעדכון הפרטים");
            }

            var updatedUser = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == updateDto.PhoneNumber);

            if (updatedUser == null)
            {
                return BadRequest("המשתמש לא נמצא לאחר העדכון.");
            }

            return CreateUserObject(updatedUser);
        }


        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {


            var phoneNumber = User.FindFirstValue(ClaimTypes.MobilePhone);

            _logger.LogInformation($"Extracted phone number from claims: {phoneNumber}");

            var user = await _context.Users.FirstOrDefaultAsync(x => x.PhoneNumber == phoneNumber);

            if (user != null)
            {
                var image = await _context.Photos.FindAsync(user.ImageId);

                if (image != null)
                {
                    user.Image = image;
                }

                return CreateUserObject(user);
            }

            return NotFound();

        }
        private UserDto CreateUserObject(UserApp user)
        {
            return new UserDto
            {
                Token = _tokenService.CreateToken(user),
                Role = user.Role,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Image = user.Image?.Url
            };
        }
    }
}