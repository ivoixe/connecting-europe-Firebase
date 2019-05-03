import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;


public class Myservice extends BroadcastReceiver {
 @Override
 public void onReceive(Context context, Intent intent) {
  if ("android.intent.action.BOOT_COMPLETED".equals(intent.getAction())) {
   Intent pushIntent = new Intent(context, BackgroundService.class);
   context.startService(pushIntent);
   JOptionPane.showMessageDialog(frame, "thank you for using java");
  }
 }
}