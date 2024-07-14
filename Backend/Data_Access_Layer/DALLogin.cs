using Data_Access_Layer.Repository;
using Data_Access_Layer.Repository.Entities;
using System.Data;

namespace Data_Access_Layer
{
    public class DALLogin
    {
        private readonly AppDbContext _cIDbContext;
        public DALLogin(AppDbContext cIDbContext)
        {
            _cIDbContext = cIDbContext;
        }
        public User GetUserById(int userId)
        {
            try
            {      User user = new User();
                    // Retrieve the user by ID
                    user = _cIDbContext.User.FirstOrDefault(u => u.Id == userId && !u.IsDeleted);

                    if (user != null)
                    {
                        return user;
                    }
                    else
                    {
                        throw new Exception("User not found.");
                    }
            }
            catch (Exception)
            {
                throw;
            }
        }
public UserDetail GetUserProfileById(int userId)
        {
            try
            {
                UserDetail userDetail = _cIDbContext.UserDetail.FirstOrDefault(ud => ud.UserId == userId && !ud.IsDeleted);

                if (userDetail != null)
                {
                    return userDetail;
                }
                else
                {
                    throw new Exception("User not found.");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
 public string Register(User user)
{
    string result = "";
    try
    {
        // Check if the email address already exists
        bool emailExists = _cIDbContext.User.Any(u => u.EmailAddress == user.EmailAddress && !u.IsDeleted);

        if (!emailExists)
        {
            // Get the maximum EmployeeId, default to 0 if no entries exist
            int? maxEmployeeId = _cIDbContext.UserDetail
                .Select(ud => (int?)ud.EmployeeId) // Ensure this is nullable
                .Max();

            // Use 0 if there are no entries
            int newEmployeeId = (maxEmployeeId ?? 0) + 1;

            // Get the next Id for the user
            int? maxId = _cIDbContext.User.Max(ud => (int?)ud.Id);
            int newUserId = (maxId ?? 0) + 1;

            // Create a new user entity
            var newUser = new User
            {
                Id = newUserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                EmailAddress = user.EmailAddress,
                Password = user.Password,
                UserType = user.UserType,
                CreatedDate = DateTime.UtcNow,
                IsDeleted = false
            };

            var newUserDetail = new UserDetail
            {
                UserId = newUserId,
                Name = user.FirstName,
                Surname = user.LastName,
                EmployeeId = newEmployeeId, // Directly assign int
                Department = "IT",
                Status = true,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow,
                IsDeleted = false
            };

            // Add the new user to the database
            _cIDbContext.User.Add(newUser);
            _cIDbContext.UserDetail.Add(newUserDetail);
            _cIDbContext.SaveChanges();

            result = "User registered successfully.";
        }
        else
        {
            result = "Email Address Already Exists.";
        }
    }
    catch (Exception ex)
    {
        // Log exception if needed
        throw;
    }
    return result;
}

   public string UpdateUser(User updatedUser)
{
    string result = "";
    try
    {
        // Fetch user by ID
        var existingUser = _cIDbContext.User.FirstOrDefault(u => u.Id == updatedUser.Id && !u.IsDeleted);
        var existingUserDetail = _cIDbContext.UserDetail.FirstOrDefault(u => u.UserId == updatedUser.Id && !u.IsDeleted);

        if (existingUser != null && existingUserDetail != null)
        {
            // Update user details
            existingUser.FirstName = updatedUser.FirstName;
            existingUser.LastName = updatedUser.LastName;
            existingUser.PhoneNumber = updatedUser.PhoneNumber;
            existingUser.ModifiedDate = DateTime.UtcNow;

            existingUserDetail.FirstName = updatedUser.FirstName;
            existingUserDetail.LastName = updatedUser.LastName;
            existingUserDetail.PhoneNumber = updatedUser.PhoneNumber;
            existingUserDetail.EmailAddress = updatedUser.EmailAddress;
            existingUserDetail.Name = updatedUser.FirstName;
            existingUserDetail.Surname = updatedUser.LastName;
            existingUserDetail.ModifiedDate = DateTime.UtcNow;

            // Save changes to the database
            _cIDbContext.SaveChanges();

            result = "User updated successfully.";
        }
        else
        {
            throw new Exception("User not found or already deleted.");
        }
    }
    catch (Exception ex)
    {
        // Optionally log the exception details
        throw new Exception($"An error occurred while updating the user: {ex.Message}");
    }
    return result;
}


public string UpdateUserDetail(UserDetail updatedUserDetail)
{
    string result = "";
    try
    {
        // Fetch user detail by ID
        var existingUserDetail = _cIDbContext.UserDetail.FirstOrDefault(u => u.Id == updatedUserDetail.Id && !u.IsDeleted);

        if (existingUserDetail != null)
        {
            // Update user detail
            existingUserDetail.Name = updatedUserDetail.Name;
            existingUserDetail.Surname = updatedUserDetail.Surname;
            existingUserDetail.EmployeeId = updatedUserDetail.EmployeeId;
            existingUserDetail.Manager = updatedUserDetail.Manager;
            existingUserDetail.Title = updatedUserDetail.Title;
            existingUserDetail.Avilability = updatedUserDetail.Avilability;
            existingUserDetail.CityId = updatedUserDetail.CityId;
            existingUserDetail.CountryId = updatedUserDetail.CountryId;
            existingUserDetail.Department = updatedUserDetail.Department;
            existingUserDetail.LinkdInUrl = updatedUserDetail.LinkdInUrl;
            existingUserDetail.MyProfile = updatedUserDetail.MyProfile;
            existingUserDetail.MySkills = updatedUserDetail.MySkills;
            existingUserDetail.Status = updatedUserDetail.Status;
            existingUserDetail.UserId = updatedUserDetail.UserId;
            existingUserDetail.UserImage = updatedUserDetail.UserImage;
            existingUserDetail.WhyIVolunteer = updatedUserDetail.WhyIVolunteer;
            existingUserDetail.ModifiedDate = DateTime.UtcNow;

            // Save changes to the database
            _cIDbContext.SaveChanges();

            result = "User detail updated successfully.";
        }
        else
        {
            throw new Exception("User detail not found or already deleted.");
        }
    }
    catch (Exception ex)
    {
        // Optionally log the exception details
        throw new Exception($"An error occurred while updating the user detail: {ex.Message}");
    }
    return result;
}

        public User LoginUser(User user)
        {
            User userObj = new User();
            try
            {
                    var query = from u in _cIDbContext.User
                                where u.EmailAddress == user.EmailAddress && u.IsDeleted == false
                                select new
                                {
                                    u.Id,
                                    u.FirstName,
                                    u.LastName,
                                    u.PhoneNumber,
                                    u.EmailAddress,
                                    u.UserType,
                                    u.Password,
                                    UserImage = u.UserImage
                                };

                    var userData = query.FirstOrDefault();

                    if (userData != null)
                    {
                        if (userData.Password == user.Password)
                        {
                            userObj.Id = userData.Id;
                            userObj.FirstName = userData.FirstName;
                            userObj.LastName = userData.LastName;
                            userObj.PhoneNumber = userData.PhoneNumber;
                            userObj.EmailAddress = userData.EmailAddress;
                            userObj.UserType = userData.UserType;
                            userObj.UserImage = userData.UserImage;
                            userObj.Message = "Login Successfully";
                        }
                        else
                        {
                            userObj.Message = "Incorrect Password.";
                        }
                    }
                    else
                    {
                        userObj.Message = "Email Address Not Found.";
                    }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return userObj;
        }
    }
}
