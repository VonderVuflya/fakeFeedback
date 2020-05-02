const { axios } = require("./fakeBackend/mock");

const getFeedbackByProductViewData = async (product, actualize = false) => {
  try {
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

    const feedback = feedbackRes.data.feedback
      .map((comment) => {
        const user = uesrsRes.data.users.find((user) => user.id === comment.userId);
        return {
          ...comment,
          date: new Date(comment.date).toLocaleString('ru').split(" ")[0],
          user: `${user.name} (${user.email})`,
        };
      })
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    if (actualize) {
      const actualizeFeedback = feedback.map((comment) => {
        const allUserComments = feedback
          .filter((userComment) => userComment.user === comment.user)
          .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
        return allUserComments[allUserComments.length - 1];
      });

      return {
        feedback: actualizeFeedback.filter(onlyUnique).sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        }),
      };
    }

    if (feedbackRes.data.feedback.length === 0) {
      return { message: "Отзывов пока нет" };
    }
    return { feedback };
  } catch (e) {
    return { message: "Такого продукта не существует" };
  }
};

module.exports = { getFeedbackByProductViewData };
