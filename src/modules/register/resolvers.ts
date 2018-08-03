import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import * as yup from "yup";
import { formatYupError } from "../../utils/formatYupError";
import { duplicateEmail } from "./errorMessage";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3)
    .max(255)
    .email(),
  password: yup
    .string()
    .min(3)
    .max(255)
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => "bye"
  },
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments) => {
      const { email, password } = args;
      try {
        // Abort early true will stop as soon as one error is found
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userAlreadyExistis = await User.findOne({
        where: { email },
        select: ["id"]
      });

      if (userAlreadyExistis) {
        return [
          {
            path: "email",
            message: duplicateEmail
          }
        ];
      }

      const user = await User.create({
        email,
        password: hashedPassword
      });

      await user.save();

      return null;
    }
  }
};
