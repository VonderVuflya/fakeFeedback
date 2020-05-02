const { axios } = require("./fakeBackend/mock");

const getFeedbackByProductViewData = async (product, actualize = false) => {
  const feedbackRes = await axios.get(`/feedback`, {
    params: {
      product,
    },
  });

  const userIds = feedbackRes.data.feedback.map((comment) => comment.userId);
  const uesrsRes = await axios.get(`/users`, {
    params: {
      ids: userIds,
    },
  });

  const feedback = feedbackRes.data.feedback.map((comment) => {
    const user = uesrsRes.data.users.find((user) => user.id === comment.userId);
    return {
      ...comment,
      user,
    };
  });

  return {
    feedback: [...feedback],
  };
};

module.exports = { getFeedbackByProductViewData };
