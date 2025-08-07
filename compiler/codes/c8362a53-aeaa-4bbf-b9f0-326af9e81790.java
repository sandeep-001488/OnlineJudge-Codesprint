import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Log input start
        System.out.println("Reading input...");

        int n = sc.nextInt();
        System.out.println("Array size: " + n);

        int[] arr = new int[n];
        for(int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
            System.out.println("Read arr[" + i + "] = " + arr[i]);
        }

        // Log input complete
        System.out.println("Completed reading input. Starting processing...");

        HashMap<Integer, Integer> map = new HashMap<>();
        map.put(0, -1);
        int sum = 0;
        int maxLen = 0;

        for(int i = 0; i < n; i++) {
            sum += (arr[i] == 0) ? -1 : 1;
            System.out.println("Index: " + i + ", Value: " + arr[i] + ", Sum: " + sum);

            if(map.containsKey(sum)) {
                int prevIndex = map.get(sum);
                maxLen = Math.max(maxLen, i - prevIndex);
                System.out.println("Sum seen before at index " + prevIndex + ", MaxLen updated to: " + maxLen);
            } else {
                map.put(sum, i);
                System.out.println("New sum encountered: " + sum + ", storing index: " + i);
            }
        }

        System.out.println("Final maxLen: " + maxLen);
    }
}
