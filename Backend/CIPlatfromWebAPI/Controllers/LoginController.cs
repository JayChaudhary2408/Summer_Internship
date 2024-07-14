using Business_logic_Layer;
using Data_Access_Layer.Repository.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {       
        private readonly BALLogin _balLogin;
        ResponseResult result = new ResponseResult();
        public LoginController(BALLogin balLogin)
        {           
            _balLogin = balLogin;
        }
            

        [HttpPost]
        [Route("LoginUser")]
        public ResponseResult LoginUser(User user)
        {
            try
            {                                
                result.Data = _balLogin.LoginUser(user);
                result.Result = ResponseStatus.Success;
            }
            catch (Exception ex)
            {
                result.Result = ResponseStatus.Error;
                result.Message = ex.Message;
            }
            return result;
        }
       

        [HttpPost]
        [Route("Register")]
        public ResponseResult RegisterUser(User user)
        {
            try
            {
             
                result.Data = _balLogin.Register(user);
                result.Result = ResponseStatus.Success;
            }
            catch (Exception ex)
            {
                result.Result = ResponseStatus.Error;
                result.Message = ex.Message;
            }
            return result;
        }

        [HttpGet]
        [Route("GetUserById/{id}")]
        [Authorize]
        public ResponseResult GetUserById(int id)
        {
            try
            {
                result.Data = _balLogin.GetUserById(id);
                result.Result = ResponseStatus.Success;
            }
            catch (Exception ex)
            {
                result.Result = ResponseStatus.Error;
                result.Message = ex.Message;
            }
            return result;
        }
        [HttpGet("GetUserProfileById/{userId}")]
        public ActionResult<UserDetail> GetUserProfileById(int userId)
        {
            try
            {
                var userDetail = _balLogin.GetUserProfileById(userId);
                return Ok(userDetail);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPost]
        [Route("UpdateUser")]
        [Authorize]
        public ResponseResult UpdateUser(User user)
        {
            try
            {
                result.Data = _balLogin.UpdateUser(user);
                result.Result = ResponseStatus.Success;
            }
            catch (Exception ex)
            {
                result.Result = ResponseStatus.Error;
                result.Message = ex.Message;
            }
            return result;
        }

        [HttpPost]
[Route("UpdateUserDetail")]
[Authorize]
public ResponseResult UpdateUserDetail(UserDetail userDetail)
{
    try
    {
        result.Data = _balLogin.UpdateUserDetail(userDetail);
        result.Result = ResponseStatus.Success;
    }
    catch (Exception ex)
    {
        result.Result = ResponseStatus.Error;
        result.Message = ex.Message;
    }
    return result;
}

    }
}
