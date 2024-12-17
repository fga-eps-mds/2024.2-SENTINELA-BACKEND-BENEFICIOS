jest.mock("jsonwebtoken");

describe("Token functions", () => {
    let jwt;
    let generateToken, checkToken, tokenValidation;

    beforeEach(() => {
        process.env.SECRET = "test_secret";
        jest.resetModules();
        jwt = require("jsonwebtoken");
        const tokenModule = require("../Util/token");
        generateToken = tokenModule.generateToken;
        checkToken = tokenModule.checkToken;
        tokenValidation = tokenModule.tokenValidation;
    });

    describe("generateToken", () => {
        it("should generate a valid JWT token", () => {
            const user_id = "123";
            const fakeToken = "fake_token";

            jwt.sign.mockReturnValue(fakeToken);

            const token = generateToken(user_id);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user_id },
                process.env.SECRET,
                { expiresIn: "30d" }
            );
            expect(token).toBe(fakeToken);
        });
    });

    describe("checkToken", () => {
        it("should return user ID if token is valid", () => {
            const user_id = "123";
            const fakeToken = "valid_token";

            jwt.verify.mockReturnValue({ id: user_id });

            const result = checkToken(fakeToken);

            expect(jwt.verify).toHaveBeenCalledWith(
                fakeToken,
                process.env.SECRET
            );
            expect(result).toBe(user_id);
        });

        it("should return null if token is invalid", () => {
            const fakeToken = "invalid_token";

            jwt.verify.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            const result = checkToken(fakeToken);

            expect(jwt.verify).toHaveBeenCalledWith(
                fakeToken,
                process.env.SECRET
            );
            expect(result).toBeNull();
        });
    });

    describe("tokenValidation middleware", () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        it("should call next() if token is valid", () => {
            const req = { headers: { authorization: "Bearer valid_token" } };
            const user_id = "123";

            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: user_id });
            });

            tokenValidation(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith(
                "valid_token",
                process.env.SECRET,
                expect.any(Function)
            );
            expect(req.userId).toBe(user_id);
            expect(next).toHaveBeenCalled();
        });

        it("should return 401 if token is invalid", () => {
            const req = { headers: { authorization: "Bearer invalid_token" } };

            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new Error("Invalid token"), null);
            });

            tokenValidation(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                mensagem: "Token inválido ou expirado.",
            });
            expect(next).not.toHaveBeenCalled();
        });

        it("should return 401 if token is not provided", () => {
            const req = { headers: {} };

            tokenValidation(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                mensagem: "Tokem não fornecido.",
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
});
