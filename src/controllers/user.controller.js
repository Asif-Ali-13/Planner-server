import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { deleteOnCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); 

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating tokens");
    }
}

export const signUpUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "User already exists");

    const defautAvatar = {
        url: "https://www.gravatar.com/avatar/0?d=mp",
        publicId: "defaultAvatar"
    }

    const user = await User.create({ username, email, password, avatar: defautAvatar });
    if (!user) throw new ApiError(500, "Error creating user");

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
    return res.status(200).json(new ApiResponse(201, createdUser, "User created successfully"));
});

export const signInUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if(!username) throw new ApiError(400, "username is required");

    const user = await User.findOne({username: username});
    if(!user) throw new ApiError(400, "user does not exist");
    
    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) throw new ApiError(400, "Invalid user Credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");
    const options = { http: true, secure: true }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse( 
        201, 
        { user: loggedInUser, accessToken, refreshToken }, 
        "User loggedIn successfully!"
    ));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(201, req.user, "User fetched successfully"));
});

export const signOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 , accessToken: 1 } },
        { new: true }
    );

    const options = { httpOnly: true, secure: true };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "User loggedOut successfully"));
});

export const updateUserAvatar = asyncHandler( async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar) throw new ApiError(500, "Error while uploading Avatar");
    
    if(req.user.avatar?.publicId) await deleteOnCloudinary(req.user.avatar.publicId);

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: {
                    url: avatar.url,
                    publicId: avatar.public_id
                }
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Avatar Updated"));
})