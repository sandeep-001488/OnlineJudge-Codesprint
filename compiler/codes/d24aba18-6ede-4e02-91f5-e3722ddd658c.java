import java.util.*;

public class Main {
    public static int longestEqual01Substring(String s) {
        Map<Integer, Integer> prefixIndex = new HashMap<>();
        int maxLen = 0, prefixSum = 0;
        prefixIndex.put(0, -1);

        for (int i = 0; i < s.length(); i++) {
            prefixSum += (s.charAt(i) == '1') ? 1 : -1;

            if (prefixIndex.containsKey(prefixSum)) {
                maxLen = Math.max(maxLen, i - prefixIndex.get(prefixSum));
            } else {
                prefixIndex.put(prefixSum, i);
            }
        }

        return maxLen;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(longestEqual01Substring(s));
    }
}
