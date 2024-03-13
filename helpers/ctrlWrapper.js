const ctrlWrapper = (controller) => {
    const decotator = async (req, res, next) => {
      try {
        await controller(req, res, next);
      } catch (error) {
        next(error);
      }
    };
    return decotator;
  };
export default ctrlWrapper;