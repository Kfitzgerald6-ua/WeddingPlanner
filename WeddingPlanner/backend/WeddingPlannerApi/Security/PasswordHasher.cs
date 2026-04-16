using System.Security.Cryptography;
using System.Text;

namespace WeddingPlannerApi.Data;

public static class PasswordHasher
{
    public static string Hash(string value)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(value));
        return Convert.ToHexString(bytes);
    }

    public static bool Verify(string value, string hash)
    {
        return string.Equals(Hash(value), hash, StringComparison.Ordinal);
    }
}
