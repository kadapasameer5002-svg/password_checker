
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

#define MAX 200

// Function to compute log base 2
double log2_custom(double n) {
    return log(n) / log(2);
}

// Check weak patterns (simple version)
int is_weak_pattern(char password[]) {
    char *common[] = {
        "password","123456","12345678","qwerty",
        "abc123","111111","iloveyou","admin",
        "welcome","monkey","dragon"
    };

    for (int i = 0; i < 11; i++) {
        if (strcmp(password, common[i]) == 0)
            return 1;
    }

    // All digits
    int digit_only = 1;
    int lower_only = 1;
    for (int i = 0; password[i]; i++) {
        if (!isdigit(password[i])) digit_only = 0;
        if (!islower(password[i])) lower_only = 0;
    }
    if (digit_only || lower_only) return 1;

    return 0;
}

// Format numbers without scientific notation
void print_time(double seconds) {
    double minutes = seconds / 60.0;
    double hours   = minutes / 60.0;
    double days    = hours / 24.0;
    double years   = days / 365.0;

    printf("\nEstimated Brute-Force Crack Time:\n");
    printf("%.0f sec\n", seconds);
    printf("%.0f min\n", minutes);
    printf("%.0f hrs\n", hours);
    printf("%.0f days\n", days);
    printf("%.2f years\n", years);
}

int main() {
    char password[MAX];
    printf("Enter a password to test: ");
    scanf("%s", password);

    int length = strlen(password);

    int charset = 0, hasLower=0, hasUpper=0, hasDigit=0, hasSymbol=0;

    for (int i = 0; i < length; i++) {
        if (islower(password[i])) hasLower = 1;
        else if (isupper(password[i])) hasUpper = 1;
        else if (isdigit(password[i])) hasDigit = 1;
        else hasSymbol = 1;
    }

    if (hasLower) charset += 26;
    if (hasUpper) charset += 26;
    if (hasDigit) charset += 10;
    if (hasSymbol) charset += 32;

    double entropy = length * log2_custom(charset);

    printf("\n========== PASSWORD ANALYSIS ==========\n\n");
    printf("Password Length: %d\n", length);
    printf("Character Types Used: %d\n", charset);
    printf("Password Entropy: %.2f bits\n", entropy);

    printf("Weak Pattern Detected: %s\n",
           is_weak_pattern(password) ? "YES" : "NO");

    double combinations = pow(charset, length);
    double attempts_per_sec = 1000000000.0; // 1 Billion attempts/sec
    double crack_time = combinations / attempts_per_sec;

    print_time(crack_time);

    return 0;
}
// to print output open terminal and type ./password_analyzer.exe