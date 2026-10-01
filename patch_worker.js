const fs = require('fs');
let c = fs.readFileSync('Worker/task.html', 'utf8');

const jsAddition = `
      // Fetch Pickup Requests too
      const { data: pickupData, error: pickupError } = await supabaseClient
        .from('pickup_requests')
        .select('*, profiles!citizen_id(full_name, phone)')
        .eq('assigned_worker_id', currentUser.id)
        .in('status', ['Approved']);

      if (!pickupError && pickupData.length > 0) {
        for (const pickup of pickupData) {
          const card = document.createElement('div');
          card.className = 'task-card';
          card.innerHTML = \`
            <div class="task-header">
              <h3>Pickup: \${pickup.waste_type}</h3>
              <span class="badge badge-assigned">\${pickup.status}</span>
            </div>
            <div class="task-body">
              <div class="task-info">
                <p><strong>Quantity:</strong> \${pickup.quantity}</p>
                <p><strong>Citizen:</strong> \${pickup.profiles?.full_name || 'Citizen'} (\${pickup.profiles?.phone || 'No phone'})</p>
                <p><strong>Location:</strong> \${pickup.address}</p>
                <p><strong>Preferred Date:</strong> \${pickup.preferred_date}</p>
                <p><strong>Time Slot:</strong> \${pickup.time_slot}</p>
                
                <div style="margin-top: 1rem;">
                  <button class="btn btn-primary" onclick="completePickup('\${pickup.id}')" id="btn-pickup-\${pickup.id}">Mark as Completed</button>
                </div>
              </div>
            </div>
          \`;
          container.appendChild(card);
        }
      }
`;

c = c.replace(/if \(data\.length === 0\) {[\s\S]*?return;\s*}/, `if (data.length === 0 && (!pickupData || pickupData.length === 0)) {
        container.innerHTML = '<p class="text-center">No assigned tasks right now. Good job!</p>';
        return;
      }`);

c = c.replace(/const container = document.getElementById\('tasks-container'\);\s*container\.innerHTML = '';/, `const container = document.getElementById('tasks-container');\n      container.innerHTML = '';\n` + jsAddition);


const completePickupFunc = `
    window.completePickup = async (pickupId) => {
      const btn = document.getElementById(\`btn-pickup-\${pickupId}\`);
      btn.textContent = 'Updating...';
      btn.disabled = true;

      try {
        const { error } = await supabaseClient
          .from('pickup_requests')
          .update({ status: 'Completed' })
          .eq('id', pickupId);

        if (error) throw error;
        showToast('Pickup marked as completed!', 'success');
        fetchTasks();
      } catch (err) {
        showToast(err.message, 'error');
        btn.textContent = 'Mark as Completed';
        btn.disabled = false;
      }
    };
`;

c = c.replace(/window\.startTask = async/, completePickupFunc + '\n    window.startTask = async');

fs.writeFileSync('Worker/task.html', c);
console.log('task.html updated with pickups');
