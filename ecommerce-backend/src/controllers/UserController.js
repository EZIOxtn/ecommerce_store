export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'picture', 'role']
    });
    
    res.json({
      statusCode: 200,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to get user profile'
    });
  }
};