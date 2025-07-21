#include <iostream>
#include <vector>
#include <string>
#include <climits>
using namespace std;

class Solution {
public:
    int maxDifference(string s, int k) {
        int n = s.size();
        int maxDiff = INT_MIN;

        for (int i = 0; i < n; ++i) {
            vector<int> freq(5, 0); // Digits from '0' to '4' only
            for (int j = i; j < n; ++j) {
                freq[s[j] - '0']++;

                if (j - i + 1 >= k) {
                    for (int a = 0; a < 5; ++a) {
                        if (freq[a] % 2 == 1) { // a has odd frequency
                            for (int b = 0; b < 5; ++b) {
                                if (freq[b] > 0 && freq[b] % 2 == 0) { // b has even non-zero frequency
                                    maxDiff = max(maxDiff, freq[a] - freq[b]);
                                }
                            }
                        }
                    }
                }
            }
        }

        return (maxDiff == INT_MIN) ? -1 : maxDiff;
    }
};

int main() {
    Solution sol;

    string s;
    int k;

    
    cin >> s;
    cin >> k;

    int result = sol.maxDifference(s, k); //for
    cout << "Maximum Difference: " << result << endl;

    return 0;
}
