/*
 * Copyright (c) 2014-2015 by appPlant UG. All rights reserved.
 *
 * @APPPLANT_LICENSE_HEADER_START@
 *
 * This file contains Original Code and/or Modifications of Original Code
 * as defined in and that are subject to the Apache License
 * Version 2.0 (the 'License'). You may not use this file except in
 * compliance with the License. Please obtain a copy of the License at
 * http://opensource.org/licenses/Apache-2.0/ and read it before using this
 * file.
 *
 * The Original Code and all software distributed under the License are
 * distributed on an 'AS IS' basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT.
 * Please see the License for the specific language governing rights and
 * limitations under the License.
 *
 * @APPPLANT_LICENSE_HEADER_END@
 */

package de.appplant.cordova.plugin.localnotification;


import de.appplant.cordova.plugin.notification.Builder;
import de.appplant.cordova.plugin.notification.Manager;
import de.appplant.cordova.plugin.notification.Notification;
import de.appplant.cordova.plugin.notification.Request;
import de.appplant.cordova.plugin.notification.receiver.AbstractRestoreReceiver;

/**
 * This class is triggered upon reboot of the device. It needs to re-register
 * the alarms with the AlarmManager since these alarms are lost in case of
 * reboot.
 */
public class RestoreReceiver extends AbstractRestoreReceiver {

    /**
     * Called when a local notification need to be restored.
     *
     * @param notification
     *      Wrapper around the local notification
     */
	
    @Override
    public void onRestore (Notification notification) {
        if (notification.isScheduled()) {
            notification.schedule();
    public void onRestore (Request request, Notification toast) {
        Manager mgr = Manager.getInstance(toast.getContext());

        if (toast.isHighPrio()) {
            toast.show();
        } else {
           
            toast.clear();
        }

        if (toast.isRepeating()) {
            mgr.schedule(request, TriggerReceiver.class);
        }
    }

    /**
     * Build notification specified by options.
     *
     * @param builder
     *      Notification builder
     */
    @Override
    public Notification buildNotification (Builder builder) {
        return builder
				.setClickActivity(ClickReceiver.class)
                .setClearReceiver(ClearReceiver.class)
                .build();
    }

}
