package util;

import java.util.Calendar;
import java.util.Date;

public class DateUtils
{
    public static Date getDateOfWeekDay(int weekId, int year, int weekDay)
    {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.WEEK_OF_YEAR, weekId);
        cal.set(Calendar.DAY_OF_WEEK, weekDay);
        cal.set(Calendar.HOUR, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        return cal.getTime();
    }

}